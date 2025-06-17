<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectDocumentRequest;
use App\Http\Requests\UpdateProjectDocumentRequest;
use App\Models\ProjectDocument;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProjectDocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectDocumentRequest $request)
    {

        try {
            // Validate the request
            $validated = $request->validated();


            if ($request->hasFile('document_proof')) {
                $validated['document_proof'] = $request->file('document_proof')->store('project_documents', 'public');
            }

            // Create database record
            ProjectDocument::create(array_merge($validated, [
                'created_by' => auth()->id(),
            ]));

            return redirect()->back()->with('message', 'Image uploaded successfully');
        } catch (\Exception $e) {
            Log::error('Error uploading Image: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error uploading Image');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectDocumentRequest $request, string $id)
    {
        try {
            // Find the project document
            $projectDocument = ProjectDocument::findOrFail($id);

            // Validate the request
            $validated = $request->validated();

            // Handle file upload if new file is provided (following store function pattern)
            if ($request->hasFile('document_proof')) {
                // Delete old file if it exists
                if ($projectDocument->document_proof && Storage::disk('public')->exists($projectDocument->document_proof)) {
                    Storage::disk('public')->delete($projectDocument->document_proof);
                }

                // Store new file using the same pattern as store function
                $validated['document_proof'] = $request->file('document_proof')->store('project_documents', 'public');
            }

            // Update the record
            $projectDocument->update($validated);

            return redirect()->back()->with('message', 'Image updated successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Document not found: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Image not found');
        } catch (\Exception $e) {
            Log::error('Error updating document: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error updating Image');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Find the project document
            $projectDocument = ProjectDocument::findOrFail($id);

            // Delete the physical file from storage
            if ($projectDocument->document_proof && Storage::disk('public')->exists($projectDocument->document_proof)) {
                Storage::disk('public')->delete($projectDocument->document_proof);
            }

            $clientId = $projectDocument->client_id;

            $projectDocument->delete();

            return redirect()->route('clients.show', $clientId)->with('message', 'Image deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->with('error', 'Image not found');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error deleting Image');
        }
    }
}
