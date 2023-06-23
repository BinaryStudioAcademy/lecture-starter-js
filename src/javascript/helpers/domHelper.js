export default function createElement({ tagName, className, attributes = {}, innerText }) {
    const element = document.createElement(tagName);

    if (className) {
        const classNames = className.split(' ').filter(Boolean); // Include only not empty className values after the splitting
        element.classList.add(...classNames);
    }

    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));
    if (innerText) {
        element.innerText = innerText;
    }
    return element;
}
