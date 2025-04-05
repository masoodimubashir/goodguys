<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccountRequest extends FormRequest
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
            
            'inventory_id' => ['required', 'exists:inventories,id'],
            'item_name' => ['required', 'string', 'max:255'],
            'selling_price' => ['required', 'numeric', 'min:1'],
            'buying_price' => ['required', 'numeric', 'min:1'],
            'count' => ['required', 'integer', 'min:1'],
            'service_charge' => ['required', 'integer', 'min:0', 'max:100'],

        ];
    }
}
