<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseListRequest extends FormRequest
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
            'list_name' => 'required|string|max:255',
            'vendor_id' => 'required|exists:vendors,id',
            'purchase_date' => 'required|date',
            'bill' => 'nullable|file|mimes:jpeg,png,pdf|max:2048',
            'bill_total' => 'required|integer|min:0',
            'bill_description' => 'nullable|string|max:1000',
        ];
    }
}
