<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBillItemListRequest extends FormRequest
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
            'item_description' => 'required|string',
            'item_quantity' => 'required|integer',
            'item_price' => 'required|numeric',
        ];
    }
}
