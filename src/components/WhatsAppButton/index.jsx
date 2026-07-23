import './WhatsAppButton.scss'

const WHATSAPP_NUMBER = '56968998905'

function openWhatsApp() {
  const webUrl = `https://wa.me/${WHATSAPP_NUMBER}`
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (isMobile) {
    window.location.href = webUrl
    return
  }

  const openedAt = Date.now()
  window.location.href = `whatsapp://send?phone=${WHATSAPP_NUMBER}`

  setTimeout(() => {
    if (!document.hidden && Date.now() - openedAt < 2000) {
      window.open(webUrl, '_blank', 'noopener,noreferrer')
    }
  }, 1200)
}

export default function WhatsAppButton() {
  return (
    <button
      type="button"
      className="whatsapp-button"
      onClick={openWhatsApp}
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.386.703 4.607 1.912 6.47L4 29l7.723-1.874A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm0 21.818a9.77 9.77 0 0 1-4.98-1.362l-.357-.212-4.583 1.112 1.135-4.47-.233-.366A9.77 9.77 0 0 1 5.818 15c0-5.62 4.567-10.182 10.186-10.182 5.62 0 10.182 4.563 10.182 10.182 0 5.62-4.563 10.182-10.182 10.182z" />
        <path d="M21.29 17.797c-.283-.142-1.68-.828-1.94-.923-.26-.095-.45-.142-.64.142-.19.283-.735.923-.9 1.113-.166.19-.332.213-.615.07-.283-.142-1.196-.44-2.277-1.402-.842-.75-1.41-1.677-1.575-1.96-.166-.283-.018-.436.124-.577.128-.128.283-.332.425-.498.142-.166.19-.283.283-.472.095-.19.047-.355-.024-.498-.07-.142-.64-1.542-.877-2.114-.23-.554-.465-.478-.64-.487l-.545-.01c-.19 0-.498.07-.759.355-.26.283-1 1.058-1 2.581 0 1.522 1.023 2.994 1.166 3.2.142.213 2.014 3.075 4.879 4.312.682.294 1.213.47 1.628.6.684.218 1.306.187 1.798.114.549-.082 1.68-.686 1.917-1.348.237-.663.237-1.23.166-1.348-.07-.118-.26-.19-.545-.332z" />
      </svg>
    </button>
  )
}
