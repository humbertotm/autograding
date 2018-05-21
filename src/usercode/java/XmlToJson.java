import org.json.JSONObject;
import org.json.JSONArray;
import org.json.XML;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class XmlToJson{

    public static void main(String[] args) {

        String TEST_XML_STRING = getXML("xml.txt");

        String testsJSON = "{\"tests\":[";

        try {
            JSONObject xmlJSONObj = XML.toJSONObject(TEST_XML_STRING);
            JSONObject testsuite = (JSONObject) xmlJSONObj.get("testsuite");
            JSONArray testcase = (JSONArray) testsuite.get("testcase");


            for(int i=0; i<testcase.length(); i++){

                JSONObject obj = testcase.getJSONObject(i);

                if(i==0){
                    if(obj.has("failure")){
                        testsJSON += "{\""+obj.get("name")+"\":\"false\"}";
                    }else{
                        testsJSON += "{\""+obj.get("name")+"\":\"true\"}";
                    }
                }
                else{
                    if(obj.has("failure")){
                        testsJSON += ",{\""+obj.get("name")+"\":\"false\"}";
                    }else{
                        testsJSON += ",{\""+obj.get("name")+"\":\"true\"}";
                    }
                }

            }
            testsJSON += "]}";

            System.out.printf(testsJSON);
            //JSONObject json = new JSONObject(testsJSON);
            //System.out.println(json.toString(3));
        } catch (Exception je) {
            System.out.println(je.toString());
        }
    }


    public static String getXML(String file){
        String xml = "";

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String sCurrentLine;

            while ((sCurrentLine = br.readLine()) != null) {
                //System.out.println(sCurrentLine);
                xml += sCurrentLine;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return xml;
    }
}
