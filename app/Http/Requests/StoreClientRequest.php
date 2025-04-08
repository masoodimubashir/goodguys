<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientRequest extends FormRequest
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
            'client_name'     => ['required', 'string', 'max:100'],
            'client_email'    => ['required', 'string', 'email', 'max:100', 'unique:clients,client_email'],
            'site_name'       => ['required', 'string', 'max:100'],
            'client_address'  => ['required', 'string', 'max:100'],
            'client_phone'    => ['required', 'string', 'digits:10'],
            'service_charge'  => ['required', 'numeric', 'min:0', 'max:100'],
            'tax'             => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }
    
}
