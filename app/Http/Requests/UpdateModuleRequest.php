<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateModuleRequest extends FormRequest
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
            'selling_price' => 'required|integer|min:1',
            'buying_price' => 'required|integer|min:1',
            'description' => 'required|string|max:1000',
            'fields' => 'required|array|min:1',
            'fields.*.field_name' => 'required|string|max:255',
            'fields.*.si_unit' => 'required|string|max:50',
            'fields.*.dimension_value' => 'required|string|max:255'
        ];
    }
    
    public function messages(): array
    {
        return [
            'fields.required' => 'At least one attribute is required.',
            'fields.min' => 'At least one attribute must be provided.',
            'fields.*.field_name.required' => 'Field name is required .',
            'fields.*.si_unit.required' => 'SI unit is required .',
            'fields.*.dimension_value.required' => 'Dimension  is required .',
            'fields.*.field_name.max' => 'Field name cannot exceed 255 characters.',
            'fields.*.si_unit.max' => 'SI unit cannot exceed 50 characters.',
            'fields.*.dimension_value.max' => 'Dimension value cannot exceed 255 characters.'
        ];
    }
}
