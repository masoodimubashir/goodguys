<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldRequest;
use App\Http\Requests\UpdateFieldRequest;
use App\Models\Field;
use Exception;
use Inertia\Inertia;

class AdminFieldController extends Controller
{
    public function index()
    {
        return Inertia::render('Field/Field', [
            'fields' => Field::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Field/CreateField');
    }

    public function store(StoreFieldRequest $request)
    {
        try {

            Field::create(array_merge($request->validated(), [
                'created_by' => auth()->id(),
            ]));

            return redirect()->route('field.index')
                ->with('message', 'Field Created');
        } catch (Exception $e) {
            return redirect()->route('field.index')
                ->with('error', 'Failed to create field');
        }
    }

    public function edit(Field $field)
    {
        return Inertia::render('Field/EditField', [
            'field' => $field
        ]);
    }

    public function update(UpdateFieldRequest $request, Field $field)
    {
        try {
           
            $field->update($request->validated() + ['updated_by' => auth()->user()->id]);

            return redirect()->route('field.index')->with('message', 'Field Updated');
            
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to update field');
        }
    }

    public function destroy(Field $field)
    {
        try {
            $field->delete();

            return redirect()->route('field.index')
                ->with('message', 'Field Deleted');
        } catch (Exception $e) {
            return redirect()->route('field.index')
                ->with('error', 'Failed to delete field');
        }
    }
}
