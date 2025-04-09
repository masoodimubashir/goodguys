<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProformaRequest extends FormRequest
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
            'client_id' => ['required', 'exists:clients,id'],
            'client_name' => ['required', 'string'],
            'client_address' => ['required', 'string'],
            'tax' => ['required', 'numeric'],
            'service_charge' => ['required', 'numeric'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.source' => ['required', 'in:custom,module,inventory'],
            'items.*.source_id' => ['nullable', 'integer'],
            'items.*.name' => ['required', 'string'],
            'items.*.description' => ['required', 'string'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.item_dimensions' => ['required', 'array', 'min:1'],
            'items.*.item_dimensions.*.type' => ['required', 'string'],
            'items.*.item_dimensions.*.value' => ['required', 'numeric'],
            'items.*.item_dimensions.*.si' => ['required', 'string'],
        ];
    }
}
