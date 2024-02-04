const numberSort = (a, b) => {
  const numberA = a.width || 999
  const numberB = b.width || 999
  return numberB - numberA
}

export const Picture = (props) => {
  const imageBasePath = props.src.slice(0, -4)

  const sizesArray = Object
    .keys(props.sizes)
    .map((name) => ({
      name,
      width: props.sizes[name],
    }))
    .sort(numberSort)

  const lowestWidth = sizesArray.pop()

  return (
    <picture id={props.id}>
      {/* Create a source for each image with a higher width than the img.src */}
      {sizesArray.map((size) => (
        <source
          srcset={`${imageBasePath}-${size.name}.webp`}
          media={`(min-width: ${size.width}px)`}
          type="image/webp"
        />
      ))}
      {/* Use the lowest resolution image as default */}
      <img
        src={`${imageBasePath}-${lowestWidth.name}.webp`}
        alt={props.alt || 'Image'}
      />
    </picture>
  )
}
