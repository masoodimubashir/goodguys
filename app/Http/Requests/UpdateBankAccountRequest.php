<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBankAccountRequest extends FormRequest
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
            'tax_number' => 'sometimes|nullable|string|max:32',
            'bank_name' => 'sometimes|nullable|string|max:100',
            'ifsc_code' => 'sometimes|nullable|string|max:32',
            'branch_code' => 'sometimes|nullable|string|max:32',
            'holder_name' => 'sometimes|nullable|string|max:100',
            'account_number' => 'sometimes|nullable|string|max:32',
            'swift_code' => 'sometimes|nullable|string|max:32',
            'upi_number' => 'sometimes|nullable|string|max:32',
            'upi_address' => 'sometimes|nullable|string|max:250',
            'signature_image' => 'nullable|sometimes|file|mimes:jpeg,|max:2048',
            'company_stamp_image' => 'nullable|sometimes|file|mimes:jpeg,|max:2048',
            'qr_code_image' => 'nullable|sometimes|file|mimes:jpeg,|max:2048',

        ];
    }
}
