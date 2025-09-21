
// A simple DOM sanitizer to prevent XSS.
// It removes script tags and all event handler attributes.
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Cannot sanitize on the server, return as is.
    // This should be safe as we only use this on the client.
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove all script and style tags
  const scripts = doc.querySelectorAll('script, style');
  scripts.forEach(script => script.remove());

  // Remove all event handlers (onclick, onerror, etc.)
  const allElements = doc.body.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    for (let j = 0; j < el.attributes.length; j++) {
      const attrName = el.attributes[j].name;
      if (attrName.startsWith('on')) {
        el.removeAttribute(attrName);
      }
    }
    // Also check for hrefs with javascript:
    if (el.hasAttribute('href') && el.getAttribute('href')?.startsWith('javascript:')) {
      el.removeAttribute('href');
    }
  }

  return doc.body.innerHTML;
}
