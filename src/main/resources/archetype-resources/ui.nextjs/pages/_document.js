import Document, { Html, Head, Main, NextScript } from 'next/document';

import { isInEditor } from '../src/utils';

const EditHead = () => (
  <Head>
    <meta charSet="UTF-8" />
    <meta name="template" content="page-template" />
    <meta property="cq:datatype" content="JSON" />
    <meta property="cq:wcmmode" content="edit" />
    <meta
      property="cq:pagemodel_root_url"
      content="/content/${projectName}/en.model.json"
    />
    <link
      rel="stylesheet"
      href="/libs/cq/gui/components/authoring/editors/clientlibs/internal/page.css"
      type="text/css "
    />
    <link
      rel="stylesheet"
      href="/etc.clientlibs/wcm/foundation/clientlibs/main.css"
      type="text/css"
    />
    <script
      type="text/javascript"
      src="/libs/cq/gui/components/authoring/editors/clientlibs/internal/messaging.js"
    ></script>
    <script
      type="text/javascript"
      src="/libs/cq/gui/components/authoring/editors/clientlibs/utils.js"
    ></script>
    <script
      type="text/javascript"
      src="/libs/granite/author/deviceemulator/clientlibs.js"
    ></script>
    <script
      type="text/javascript"
      src="/libs/cq/gui/components/authoring/editors/clientlibs/internal/page.js"
    ></script>
    <script
      type="text/javascript"
      src="/etc.clientlibs/wcm/foundation/clientlibs/main.js"
    ></script>
    <script
      type="text/javascript"
      src="/etc.clientlibs/clientlibs/granite/jquery.js"
    ></script>
    <script
      type="text/javascript"
      src="/etc.clientlibs/clientlibs/granite/utils.js"
    ></script>
    <script
      type="text/javascript"
      src="/etc.clientlibs/clientlibs/granite/jquery/granite.js"
    ></script>
    <script
      type="text/javascript"
      src="/etc.clientlibs/foundation/clientlibs/jquery.js"
    ></script>
    <script
      type="text/javascript"
      src="/etc.clientlibs/foundation/clientlibs/shared.js"
    ></script>
  </Head>
);

class AEMDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      isInEditor: isInEditor(ctx.req),
    };
  }

  render() {
    const { isInEditor } = this.props;
    const AEMHead = isInEditor ? EditHead : Head;
    return (
      <Html>
        <AEMHead />
        <body>
          <Main />
          <script
            type="text/javascript"
            src="/libs/cq/gui/components/authoring/editors/clientlibs/internal/pagemodel/messaging.js"
          ></script>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AEMDocument;
