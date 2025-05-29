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
        Schema::create('purchase_managments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_list_id')->constrained('purchase_lists')->onDelete('cascade');
            $table->integer('amount');
            $table->string('narration');
            $table->date('transaction_date');
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
        Schema::dropIfExists('purchase_managments');
    }
};
