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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_refrence_id')->constrained('invoice_refrences')->cascadeOnDelete();
            $table->foreignId('invoice_module_id')->constrained('invoice_modules')->cascadeOnDelete();
            $table->string('item_name');
            $table->string('description')->nullable();
            $table->json('additional_description')->nullable();
            $table->unsignedBigInteger('count');
            $table->unsignedBigInteger('price');
            $table->unsignedBigInteger('service_charge');
            $table->boolean('is_price_visible');
            $table->unsignedTinyInteger('created_by')->nullable();
            $table->unsignedTinyInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
