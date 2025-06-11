<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>

    @include('layout.head')


    @include('layout.css')

    @routes

    {{-- @viteReactRefresh --}}


    {{-- <script type="module" src="{{ asset('build/assets/app-P2nxT-ty.js') }}"></script> --}}

    {{-- <link rel="stylesheet" href="{{ asset('build/assets/app-Kn4DrDVk.css') }}"> --}}
    {{-- <link rel="stylesheet" href="{{ asset('build/assets/app-D1EBmUti.css') }}"> --}}

    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"]) 

    @inertiaHead

</head>

<body class="font-sans antialiased">
    @inertia

    @include('layout.script')


</body>

</html>
