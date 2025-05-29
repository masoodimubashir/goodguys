<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVendorRequest extends FormRequest
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
            'contact_number' => 'required|string|max:20',
             'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('vendors', 'email')->ignore($this->route('vendor')) // or $this->vendor if using route-model binding
            ],
            'address' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
        ];
    }
}
