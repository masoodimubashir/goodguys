<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReturnListrequest extends FormRequest
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
            'purchased_product_id' => 'required|exists:purchased_products,id',
            'vendor_name' => 'required|string|max:255',
            'return_date' => 'required|date',
            'unit_count' => 'required|integer|min:1',
            'bill_total' => 'required|integer|min:0',
            'bill_description' => 'required|string|max:1000',
        ];

    }
}
