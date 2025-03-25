<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldUnitRequest;
use App\Http\Requests\UpdateFieldUnitRequest;
use App\Models\Field;
use App\Models\FieldUnit;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AdminFieldUnitController extends Controller
{
    public function index()
    {
        return Inertia::render('Field/FieldUnit', [
            'fieldUnits' => FieldUnit::with('field')->latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Field/CreateFieldUnit', [
            'fields' => Field::latest()->get(),
        ]);
    }

    public function store(StoreFieldUnitRequest $request)
    {
        try {

            FieldUnit::create(array_merge($request->validated(), [
                'created_by' => auth()->id(),
            ]));

            return redirect()->route('fieldunit.index')->with('message', 'Field Unit Created');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return redirect()->back()->with('error', 'Failed to create Field Unit');
        }
    }

    public function edit($id)
    {

        return Inertia::render('Field/EditFieldUnit', [
            'field' => FieldUnit::find($id),
            'fields' => Field::latest()->get(),
        ]);
    }

    public function update(UpdateFieldUnitRequest $request, $id)
    {
        try {

            $fieldUnit = FieldUnit::find($id);

            if (!$fieldUnit) {
                throw new Exception('Field Unit not found', 404);
            }

            $fieldUnit->update([
                'field_id' => $request->field_id,
                'unit_size' => $request->unit_size,
                'unit_count' => $request->unit_count,
                'updated_by' => auth()->id(),
            ]);

            return redirect()->route('fieldunit.index')->with('message', 'Field Unit Updated');
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to update Field Unit');
        }
    }

    public function destroy( $id)
    {
        try {

            $fieldUnit = FieldUnit::find($id);


            if (!$fieldUnit) {
                throw new Exception('Field Unit not found', 404);
            }

            $fieldUnit->delete();

            return redirect()->route('fieldunit.index')
                ->with('message', 'Field Unit Deleted');
        } catch (NotFoundHttpException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (Exception $e) {
            return redirect()->route('fieldunit.index')
                ->with('error', 'Failed to delete Field Unit');
        }
    }
}
