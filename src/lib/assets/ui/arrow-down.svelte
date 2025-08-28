<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="x-cutout">
      <rect width="24" height="24" fill="white" />
      <path
        d="M16 8L8 16M8.00001 8L16 16"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </mask>
  </defs>

  <circle cx="12" cy="12" r="12" fill="var(--colour-light)" mask="url(#x-cutout)" />
</svg>

<style>
  svg {
    width: 80px;
    height: auto;
    aspect-ratio: 1;
    padding: 8px;
  }

  @media (max-width: 768px) {
    svg {
      width: 70px;
    }
  }
</style>
