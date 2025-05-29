<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReturnListrequest extends FormRequest
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
            'item_name' => 'required|string|max:100',
            'return_date' => 'required|date',
            'price' => 'required|integer|min:1',
            'narration' => 'required|string|max:255',
        ];
    }
}

