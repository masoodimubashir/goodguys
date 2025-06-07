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
        Schema::create('proformas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proforma_refrence_id')->constrained('proforma_refrences')->cascadeOnDelete();
            $table->foreignId('proforma_module_id')->constrained('proforma_modules')->cascadeOnDelete();
            $table->string('item_name');
            $table->string('description')->nullable();
            $table->json('additional_description')->nullable();
            $table->unsignedBigInteger('count');
            $table->unsignedBigInteger('price')->nullable()->default(0);
            $table->unsignedBigInteger('service_charge');
            $table->unsignedTinyInteger('created_by')->nullable();
            $table->unsignedTinyInteger('updated_by')->nullable();
            $table->boolean('is_price_visible');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proformas');
    }
};
