<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVendorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'vendor_name' => 'required|string|max:255',
            'contact_number' => 'required|digits:10',
            'email' => 'required|email|unique:vendors,email|max:255',
            'address' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ];
    }

}
