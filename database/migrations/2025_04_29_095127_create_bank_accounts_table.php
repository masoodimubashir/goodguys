<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('qr_code_image');
            $table->string('bank_name');
            $table->string('ifsc_code');
            $table->string('holder_name');
            $table->string('account_number');
            $table->string('upi_number');
            $table->string('upi_address');
            $table->string('signiture_image');
            $table->string('company_stamp_image');
            $table->string('tax_number');
            $table->tinyInteger('created_by')->nullable();
            $table->tinyInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
