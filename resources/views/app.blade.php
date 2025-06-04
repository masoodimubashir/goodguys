<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @include('layout.head')
    @include('layout.css')

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/scss/style.scss', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
    @include('layout.script')
</body>
</html>