<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseProductRequest extends FormRequest
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
            'purchase_list_id' => 'required|exists:purchase_lists,id',
            'product_name' => 'required|string|min:3|max:255',
            'description' => 'required|string|min:3|max:255',
            'price' => 'required|numeric|min:1',
            'unit_count' => 'required|integer|min:1',
        ];
    }
}
