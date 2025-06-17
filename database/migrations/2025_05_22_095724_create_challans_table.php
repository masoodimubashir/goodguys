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
        Schema::create('challans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challan_refrence_id')->constrained('challan_refrences')->cascadeOnDelete();
            $table->boolean('is_price_visible');
            $table->integer('price')->default(0);
            $table->integer('qty')->default(0);
            $table->integer('total')->default(0);
            $table->boolean('payment_flow')->nullable()->comment('1=in,0=out');
            $table->longText('description');
            $table->longText('narration');
            $table->string('unit_type');
            $table->string('created_by')->nullable();
            $table->string('updated_by')->nullable();
            $table->timestamps();
        });
    }



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('challans');
    }
};
