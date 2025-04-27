<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCostIncurredRequest extends FormRequest
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
            'entry_name' => 'required|string|max:255',
            'count' => 'required|integer',
            'selling_price' => 'required|integer',
            'buying_price' => 'required|integer',
        ];
    }
}
