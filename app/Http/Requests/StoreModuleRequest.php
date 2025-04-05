<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreModuleRequest extends FormRequest
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
            'module_name' => 'required|string|max:255',
            'count' => 'required|integer|min:1',
            'selling_price' => ['required', 'integer', 'min:1'],
            'buying_price' => ['required', 'integer', 'min:1'],
            'description' => 'required|string|max:1000',
            'attributes' => 'required|array|min:1',
            'attributes.*.field_name' => 'required|string|max:255',
            'attributes.*.si_unit' => 'required|string|max:50',
            'attributes.*.dimension_value' => 'required|string|max:255'
        ];
    }
    
    public function messages(): array
    {
        return [
            'attributes.required' => 'At least one attribute is required.',
            'attributes.min' => 'At least one attribute must be provided.',
            'attributes.*.field_name.required' => 'Field name is required for each attribute.',
            'attributes.*.si_unit.required' => 'SI unit is required for each attribute.',
            'attributes.*.dimension_value.required' => 'Dimension  is required for each attribute.',
            'attributes.*.field_name.max' => 'Field name cannot exceed 255 characters.',
            'attributes.*.si_unit.max' => 'SI unit cannot exceed 50 characters.',
            'attributes.*.dimension_value.max' => 'Dimension value cannot exceed 255 characters.'
        ];
    }
}
