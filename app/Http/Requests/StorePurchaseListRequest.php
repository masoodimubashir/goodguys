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
            'vendor_name' => 'required|string|max:255',
            'purchase_date' => 'required|date',
             'bill' => 'required|file|mimes:jpeg,png,pdf|max:2048'
        ];
    }
}
