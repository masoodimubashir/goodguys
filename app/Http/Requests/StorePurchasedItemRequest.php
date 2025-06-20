<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchasedItemRequest extends FormRequest
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
            'client_id'   => 'required|exists:clients,id',
            'description' => 'required|string|max:255',
            'qty'         => 'required|integer|min:1',
            'amount'       => 'required|numeric|min:0',
            'narration'   => 'nullable|string',
            'created_at' => 'required|date',
            'multiplier'  => 'required|numeric|min:1',
            'unit_type'   => 'nullable|string|max:255',
        ];
    }
}
