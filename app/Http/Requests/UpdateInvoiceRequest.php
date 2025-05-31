<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
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

            'id' => 'required|integer|exists:invoice_refrences,id',
            'client_id' => ['required', 'exists:clients,id'],
            'client_name' => ['required', 'string'],
            'client_address' => ['required', 'string'],
            'show_all_prices' => ['required', 'boolean'],
            'products' => ['required', 'array', 'min:1'],
            'products.*.product_name' => ['required', 'string'],
            'products.*.items' => ['required', 'array', 'min:1'],
            'products.*.items.*.source' => ['required', 'in:custom,module,inventory'],
            'products.*.items.*.source_id' => ['nullable', 'integer'],
            'products.*.items.*.name' => ['required', 'string'],
            'products.*.items.*.description' => ['required', 'string'],
            'products.*.items.*.price' => ['required', 'integer', 'min:0'],
            'products.*.items.*.quantity' => ['required', 'integer', 'min:1'],
            'products.*.items.*.item_dimensions' => ['required', 'array', 'min:1'],
            'products.*.items.*.item_dimensions.*.type' => ['required', 'string'],
            'products.*.items.*.item_dimensions.*.value' => ['required', 'numeric'],
            'products.*.items.*.item_dimensions.*.si' => ['required', 'string'],

        ];
    }
}
