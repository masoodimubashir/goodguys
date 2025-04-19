<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'client_id' => ['required', 'exists:clients,id'],
            'client_name' => ['required', 'string', 'max:255'],
            'client_address' => ['required', 'string', 'max:500'],
            'service_charge' => ['required', 'numeric', 'min:0'],

            'products' => ['required', 'array', 'min:1'],
            'products.*.product_name' => ['required', 'string', 'max:255'],

            'products.*.items' => ['required', 'array', 'min:1'],
            'products.*.items.*.source' => ['required', 'in:custom,module,inventory'],
            'products.*.items.*.id' => ['sometimes', 'integer', 'exists:proformas,id'],
            'products.*.items.*.name' => ['required', 'string', 'max:255'],
            'products.*.items.*.description' => ['required', 'string', 'max:1000'],
            'products.*.items.*.price' => ['required', 'numeric', 'min:0'],
            'products.*.items.*.quantity' => ['required', 'integer', 'min:1'],
            'products.*.items.*.tax' => ['required', 'numeric', 'min:0'],

            'products.*.items.*.item_dimensions' => ['required', 'array', 'min:1'],
            'products.*.items.*.item_dimensions.*.type' => ['required', 'string', 'max:50'],
            'products.*.items.*.item_dimensions.*.value' => ['required', 'numeric'],
            'products.*.items.*.item_dimensions.*.si' => ['required', 'string', 'max:10'],

            // Conditional validation for source_id
            'products.*.items.*.source_id' => [
                'required_if:products.*.items.*.source,inventory,module',
                'nullable',
                Rule::exists('inventories', 'id')->when(
                    request()->input('products.*.items.*.source') === 'inventory',
                    function ($rule) {
                        return $rule->where('status', 'available');
                    }
                ),
                Rule::exists('modules', 'id')->when(
                    request()->input('products.*.items.*.source') === 'module',
                    function ($rule) {
                        return $rule;
                    }
                )
            ]
        ];
    }
}
