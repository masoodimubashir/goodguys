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
            'client_id'         => 'required|exists:clients,id',
            'client_name'       => 'required|string|max:255',
            'client_address'    => 'nullable|string|max:500',
            'site_name'         => 'required|string|max:255',
            'service_charge'    => 'nullable|numeric|min:0',
            'show_all_prices'   => 'required|boolean',
            'created_at' => 'required|date',

            'products'          => 'required|array|min:1',
            'products.*.module_id' => 'nullable|integer|exists:proforma_modules,id',
            'products.*.module_name' => 'required|string|max:255',
            'products.*.items'       => 'required|array|min:1',

            'products.*.items.*.name'              => 'required|string|max:255',
            'products.*.items.*.description'       => 'nullable|string|max:1000',
            'products.*.items.*.price'             => 'required|numeric|min:0',
            'products.*.items.*.quantity'          => 'required|numeric|min:0',
            'products.*.items.*.is_price_visible'  => 'required|boolean',

            'products.*.items.*.item_dimensions' => 'nullable|array',
            'products.*.items.*.item_dimensions.*' => 'array|required_with:products.*.items.*.item_dimensions',
            'products.*.items.*.item_dimensions.*.type' => 'required_with:products.*.items.*.item_dimensions.*|string',
            'products.*.items.*.item_dimensions.*.value' => 'required_with:products.*.items.*.item_dimensions.*|numeric',
            'products.*.items.*.item_dimensions.*.si' => 'required_with:products.*.items.*.item_dimensions.*|string|max:10',

        ];
    }
}
