<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyProfileRequest;
use App\Http\Requests\UpdateCompanyProfileRequest;
use App\Models\CompanyProfile;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminAdminCompanyProfile extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Profile/CompanyProfile', [
            'companyProfile' => CompanyProfile::first()
        ]);
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
    public function store(StoreCompanyProfileRequest $request)
    {
        try {

            DB::beginTransaction();
            
            $validatedData = $request->validated();

            if ($request->hasFile('logo')) {
                $validatedData['logo'] = $request->file('logo')->store('company-info', 'public');
            }

            CompanyProfile::create(array_merge($validatedData, [
                'created_by' => auth()->id(),
            ]));

            DB::commit();
            return redirect()->route('company-profile.index')->with('message', 'Profile Created Successfully');
        } catch (Exception $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return redirect()->route('company-profile.index')->with('error', 'Failed To Create Profile.');
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
    public function update(UpdateCompanyProfileRequest $request, string $id)
    {
        try {
            
            $company_profile = CompanyProfile::findOrFail($id);


            $validated = $request->validated();

            if ($request->hasFile('logo')) {
                // Delete old logo
                Storage::disk('public')->delete($company_profile->logo);

                // Store new logo and update path
                $validated['logo'] = $request->file('logo')->store('company-info', 'public');
            } else {
                // Preserve existing logo path if no new file uploaded
                $validated['logo'] = $company_profile->logo;
            }

            $company_profile->update(array_merge($validated, [
                'updated_by' => auth()->id(),
            ]));

            return redirect()->back()->with('message', 'Profile updated successfully');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed To Update Profile');
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
