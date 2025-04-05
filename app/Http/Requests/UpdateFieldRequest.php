<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFieldRequest extends FormRequest
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
             'field_name' => [
                 'required',
                 'string',
                 'max:255',
                 Rule::unique('fields', 'field_name')->ignore($this->route('field')),
             ],
             'si_unit' => ['required','string','max:255',],
             'dimension_value' => ['required','string','max:255',],

         ];
     }
     
}
