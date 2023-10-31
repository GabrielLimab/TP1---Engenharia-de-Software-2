import './Error.css'

interface ErrorProps {
  error: string
}

export function Error({error} : ErrorProps) {
  return (
    <div className="error-message">
      <span>
        {error}
      </span>
    </div>
  )
}