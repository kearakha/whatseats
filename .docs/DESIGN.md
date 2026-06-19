# Design System

## Aesthetic
Liquid Glass + Clean Minimalist
Inspired by iOS 26 liquid glass UI

## Color Palette
- Primary (Navy)  : #0A1628
- Secondary Navy  : #1E3A5F
- Accent Navy     : #2D5F8F
- White           : #FFFFFF
- Off White       : #F8F9FC
- Glass BG        : rgba(255,255,255,0.08)
- Glass Border    : rgba(255,255,255,0.15)

## Glass Effect (CSS)
background: rgba(255,255,255,0.08);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255,255,255,0.15);
border-radius: 24px;

## Typography
- Display : "Instrument Serif" (Google Fonts)
- Body    : "DM Sans" (Google Fonts)

## Spacing
- Base unit: 4px
- Radius: 16px (card), 24px (modal), 999px (pill)

## Motion
- Wheel spin: ease-out cubic, duration 4-6s
- Modal appear: spring, stiffness 300 damping 30
- List item: staggered fade-in