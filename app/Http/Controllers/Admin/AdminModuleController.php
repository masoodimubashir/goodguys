<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreModuleRequest;
use App\Http\Requests\UpdateModuleRequest;
use App\Models\Field;
use App\Models\FieldUnit;
use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class AdminModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return Inertia::render('Modules/Module', [
            'modules' => Module::latest()->get()->map(function ($module) {
                return [
                    'id' => $module->id,
                    'module_name' => $module->module_name,
                    'count' => $module->count,
                    'attributes' => Field::whereIn('id', $module->field_ids)->pluck('field_name'),
                    'created_by' => $module->created_by,
                ];
            }),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Modules/CreateModule', [
            'fields' => Field::latest()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */

     public function store(StoreModuleRequest $request)
     {
         try {
             DB::beginTransaction();             dd($request->input('attributes'));

     
             $fieldIds = [];

     
             foreach ($request->input('attributes', []) as $attribute) {
                 if (!empty($attribute['field_id'])) {
                     $fieldIds[] = $attribute['field_id'];
                 } elseif (!empty($attribute['field_name'])) {
                     $field = Field::create([
                         'field_name' => $attribute['field_name'],
                         'created_by' => auth()->user()->id,
                     ]);
     
                     $fieldIds[] = $field->id;
                 }
             }
     
             Module::create([
                 'module_name' => $request->module_name,
                 'count'       => $request->count,
                 'description' => $request->description,
                 'created_by'  => auth()->user()->id,
                 'field_ids'   => $fieldIds,
             ]);
     
             DB::commit();
             return redirect()->route('module.index')->with('message', 'Module created.');
         } catch (\Exception $e) {
             DB::rollback();
             Log::error($e->getMessage());
             return redirect()->route('module.index')->with('error', 'Failed to create: ' . $e->getMessage());
         }
     }
     

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Module $module)
    {
        return Inertia::render('Modules/EditModule', [
            'module' => $module,
            'fields' => Field::latest()->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateModuleRequest $request, Module $module)
    {
        try {

            DB::beginTransaction();
    
            $fieldIds = [];
    
            foreach ($request->input('attributes', []) as $attribute) {
                if (!empty($attribute['field_id'])) {
                    $fieldIds[] = $attribute['field_id'];
                } elseif (!empty($attribute['field_name'])) {
                    $field = Field::create([
                        'field_name' => $attribute['field_name'],
                        'updated_by' => auth()->user()->id,
                    ]);
                    $fieldIds[] = $field->id;
                }
            }
    
            $module->update([
                'module_name' => $request->module_name,
                'count'       => $request->count,
                'description' => $request->description,
                'field_ids'   => $fieldIds,
            ]);
    
            DB::commit();
            return redirect()->route('module.index')->with('message', 'Module updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return redirect()->route('module.index')->with('error', 'Failed to update: ' . $e->getMessage());
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        try {
            $module->delete();

            return redirect()->route('module.index')->with('message', 'Module deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('module.index')->with('error', 'Failed to delete module.');
        }
    }
}



