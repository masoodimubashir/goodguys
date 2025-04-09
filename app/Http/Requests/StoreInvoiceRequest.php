<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
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
            'client_name' => 'required|string|max:255',
            'client_address' => 'required|string|max:255',
            'tax' => 'required|numeric|min:0',
            'service_charge' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.source' => 'required|string|in:inventory,module,custom',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'required|string|max:255',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.item_dimensions' => 'nullable|array',

        ];
    }
}
