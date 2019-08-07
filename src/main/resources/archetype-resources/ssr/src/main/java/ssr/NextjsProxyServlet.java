/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
 package ${package}.ssr;

 import java.io.IOException;
 
 import org.jetbrains.annotations.NotNull;
 import javax.servlet.Servlet;
 import javax.servlet.ServletException;
 import javax.servlet.http.HttpServletResponse;
 
 import org.apache.http.client.methods.CloseableHttpResponse;
 import org.apache.http.client.methods.HttpGet;
 import org.apache.http.impl.client.CloseableHttpClient;
 import org.apache.http.osgi.services.HttpClientBuilderFactory;
 import org.apache.http.util.EntityUtils;
 import org.apache.sling.api.SlingHttpServletRequest;
 import org.apache.sling.api.SlingHttpServletResponse;
 import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
 import org.osgi.service.component.annotations.Activate;
 import org.osgi.service.component.annotations.Component;
 import org.osgi.service.component.annotations.Reference;
 import org.osgi.service.metatype.annotations.AttributeDefinition;
 import org.osgi.service.metatype.annotations.AttributeType;
 import org.osgi.service.metatype.annotations.Designate;
 import org.osgi.service.metatype.annotations.ObjectClassDefinition;
 import org.slf4j.Logger;
 import org.slf4j.LoggerFactory;
  
 @Component(
         service = {Servlet.class},
         property = {
                 "sling.servlet.paths=" + "/bin/${projectName}/proxyservlet"
         }
 )
 @Designate( ocd = NextjsProxyServlet.Configuration.class )
 /**
  * Service responsible for proxying js references to the proxy node server
  */
 public class NextjsProxyServlet extends SlingSafeMethodsServlet {
 
     private static final Logger log = LoggerFactory.getLogger(NextjsProxyServlet.class);
 
     private static final String DEFAULT_HOST_REACT = "http://localhost:4200";
 
     @Reference
     private HttpClientBuilderFactory clientBuilderFactory;
 
     private String host_react;

     @Activate
     protected void activate(Configuration configuration) {
         host_react = configuration.sample_spa_ssr_react_server();
     }
 
     @Override
     protected void doGet(@NotNull SlingHttpServletRequest request, @NotNull SlingHttpServletResponse response) throws ServletException, IOException {
        try {
            // this should come from a config
            final String HOST = host_react;
            final String URL = HOST + request.getPathInfo();
            CloseableHttpClient client = clientBuilderFactory.newBuilder().build();

            HttpGet getMethod = new HttpGet(URL);

            CloseableHttpResponse preRenderedResponse = client.execute(getMethod);

            String responseBody = EntityUtils.toString(preRenderedResponse.getEntity());

            int statusCode = preRenderedResponse.getStatusLine().getStatusCode();

            if (statusCode >= 400) {
                throw new IOException("Rendering App server-side finished with error code: " + statusCode
                        + " and message: " + responseBody);
            }
            response.setHeader("Content-Type", "text/javascript");
            response.getWriter().write(responseBody);

        } catch (IOException | NullPointerException e) {
            // TODO: different problems may result in different error handling and codes
            log.error("Error while trying to Render App server-side: " + e.getMessage(), e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.toString());
        }
     }
 
 
     @ObjectClassDefinition(name="Single Page Applications - Server Side Rendering Configuration",
             description = "URLs of the servers responsible for returning the HTML based on the model data send in request")
     @interface Configuration {
         @AttributeDefinition(
                 name = "React Node Server URL",
                 description = "full URL, i.e. " + DEFAULT_HOST_REACT,
                 type = AttributeType.STRING
         )
         String sample_spa_ssr_react_server() default DEFAULT_HOST_REACT;
     }
 }
 