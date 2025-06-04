<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreModuleRequest;
use App\Http\Requests\UpdateModuleRequest;
use App\Models\Field;
use App\Models\FieldUnit;
use App\Models\Module;
use Illuminate\Http\Request;
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
            'modules' => Module::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Modules/CreateModule');
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(StoreModuleRequest $request)
    {
        try {
            
            DB::beginTransaction();

            $fields = [];


            foreach ($request->input('attributes', []) as $attribute) {

                $fieldName = $attribute['field_name'];
                $siUnit = $attribute['si_unit'];
                $dimensionValue = $attribute['dimension_value'];

                $field = Field::create([
                    'field_name' => $fieldName,
                    'si_unit'    => $siUnit,
                    'dimension_value' => $dimensionValue,
                    'created_by' => auth()->id(),
                ]);
                $fieldName = $field->field_name;
                $siUnit = $field->si_unit;
                $dimensionValue = $field->dimension_value;

                $formatted = trim("{$fieldName},{$dimensionValue},{$siUnit}");
                $fields[] = $formatted;
            }

            Module::create([
                'module_name' => $request->module_name,
                'count'       => $request->count,
                'description' => $request->description,
                'selling_price' => $request->selling_price,
                'buying_price' => $request->buying_price,
                'created_by'  => auth()->id(),
                'fields'      => $fields,
            ]);

            DB::commit();
            return redirect()->route('module.index')->with('message', 'Module created.');
        } catch (\Exception $e) {
            DB::rollBack();
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

            $formattedFields = [];

            foreach ($request->input('fields', []) as $fieldData) {

                $field = Field::create([
                    'field_name' => $fieldData['field_name'],
                    'si_unit' => $fieldData['si_unit'],
                    'dimension_value' => $fieldData['dimension_value'],
                    'created_by' => auth()->id(),
                ]);

                $formatted = trim("{$field->field_name},{$field->dimension_value},{$field->si_unit}");
                $formattedFields[] = $formatted;
            }

            $module->update([
                'module_name' => $request->module_name,
                'count' => $request->count,
                'description' => $request->description,
                'fields' => $formattedFields,
                'selling_price' => $request->selling_price,
                'buying_price' => $request->buying_price,
                'updated_by' => auth()->id(),
            ]);

            DB::commit();
            return redirect()->route('module.index')->with('message', 'Module updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
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
