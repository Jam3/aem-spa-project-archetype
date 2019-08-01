require('es6-promise').polyfill();

import { CustomModelClient } from '../src/CustomModelClient';
import React from 'react';
import App from '../src/components/App';
import { StaticRouter, BrowserRouter } from 'react-router-dom';
import { Constants, EditorContext } from '@adobe/cq-react-editable-components';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';

import '../src/ImportComponents';
import {
  getRootModel,
  setRootModel,
  isInEditor,
  isBrowser,
} from '../src/utils';

class AEMIndex extends React.Component {
  static async getInitialProps({ req }) {
    if (req) {
      const modelClient = new CustomModelClient();
      const model = req.body;
      const location = req.originalUrl;

      return ModelManager.initialize({
        path: '/content/${projectName}/en',
        modelClient,
        model,
      }).then(model => ({
        model,
        isInEditor: isInEditor(req),
        location,
      }));
    } else {
      // we are in the browser now
      return {
        model: getRootModel(),
        isInEditor: false,
        location: window.location.pathname,
      };
    }
  }

  constructor(props) {
    super(props);
    if (isBrowser()) {
      const { model } = props;
      setRootModel(model);
      ModelManager.initialize({
        model,
        modelClient: new CustomModelClient('http://localhost:4502'),
      });
    }
  }

  render() {
    const { model, isInEditor, location } = this.props;
    const Router = typeof window !== 'undefined' ? BrowserRouter : StaticRouter;
    return (
      <Router location={location} context={{}}>
        <EditorContext.Provider value={isInEditor}>
          <App
            cqChildren={model[Constants.CHILDREN_PROP]}
            cqItems={model[Constants.ITEMS_PROP]}
            cqItemsOrder={model[Constants.ITEMS_ORDER_PROP]}
            cqPath="/content/${projectName}/en"
            locationPathname={location}
          />
        </EditorContext.Provider>
      </Router>
    );
  }
}

export default AEMIndex;
