<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProformaRequest extends FormRequest
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
            'client_id' => 'required|exists:clients,id',
            'module_id' => 'required|exists:modules,id',
            'item_name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'count' => 'required|integer|min:1',
            'price' => 'required|integer|min:1',
            'tax' => 'required|integer|min:0|max:100',
            'service_charge' => 'required|integer|min:0|max:100',
        ];
    }
}
