<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseListPaymentForm extends FormRequest
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
            'vendor_id' => 'required|exists:vendors,id',
            'client_id' => 'required|exists:clients,id',
            'amount' => 'required|integer',
            'narration' => 'nullable|string|max:255',
            'created_at' => 'required|date',
        ];
    }

    public function messages(): array
    {
        return [
            'vendor_id.required' => 'party name is required.',
        ];
    }
}
