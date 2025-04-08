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
            $table->foreignId('proforma_refrence_id')->constrained()->cascadeOnDelete();
            $table->string('item_name');
            $table->string('description');
            $table->json('additional_description');
            $table->unsignedBigInteger('count');
            $table->unsignedBigInteger('price');
            $table->unsignedBigInteger('tax');
            $table->unsignedBigInteger('service_charge');
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
        Schema::dropIfExists('proformas');
    }
};
