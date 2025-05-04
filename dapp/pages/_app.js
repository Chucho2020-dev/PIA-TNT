import '../src/app/globals.css';
import { createStore } from "redux";
import { Provider } from "react-redux";
import addresses from '../store/reducers/addresses';

const store = createStore(addresses);

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Component {...pageProps}/>
        </Provider>
    )
}

export default MyApp;