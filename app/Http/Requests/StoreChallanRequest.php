<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChallanRequest extends FormRequest
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

            "client_id"=> "required|exists:clients,id",
            "purchase_list_id" => 'required|exists:purchase_lists,id',
            "service_charge" => 'required|numeric|min:1',
            "challan" => "array|min:1",

        ];
    }
}
