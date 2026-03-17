export const parseCopybookXml = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      console.error("XML parsing error:", xmlDoc.getElementsByTagName("parsererror")[0].textContent);
      return [];
    }

    const copybooks = [];
    const copybookElements = xmlDoc.getElementsByTagName("copybook");

    Array.from(copybookElements).forEach((copybookElement) => {
      const rootItems = Array.from(copybookElement.querySelectorAll("item[level='01']"));

      rootItems.forEach((rootItem, index) => {
        const copybookRecord = buildTreeFromItem(rootItem, `cb-${index + 1}`);
        if (copybookRecord) {
          copybooks.push(copybookRecord);
        }
      });
    });

    return copybooks;
  } catch (error) {
    console.error("Error parsing copybook XML:", error);
    return [];
  }
};

const buildTreeFromItem = (itemElement, idPrefix) => {
  const name = itemElement.getAttribute("name");
  const picture = itemElement.getAttribute("picture");
  const level = itemElement.getAttribute("level");
  const storageLength = itemElement.getAttribute("storage-length");

  if (!name) return null;

  const node = {
    id: idPrefix,
    name: name,
    type: getFieldType(picture, itemElement),
    storageLength: storageLength,
    picture: picture,
  };

  const currentLevel = Number.parseInt(level, 10);
  const directChildElements = Array.from(itemElement.children).filter((child) => {
    if (child.tagName !== "item") return false;
    const childLevel = Number.parseInt(child.getAttribute("level") || "0", 10);
    return childLevel > currentLevel;
  });

  if (directChildElements.length > 0) {
    node.children = [];
    let childIndex = 0;
    
    directChildElements.forEach((childElement) => {
      childIndex++;
      const childNode = buildTreeFromItem(childElement, `${idPrefix}-${childIndex}`);
      if (childNode) {
        node.children.push(childNode);
      }
    });
  }

  return node;
};

const getFieldType = (picture, itemElement) => {
  const hasChildren = itemElement.querySelector("item") !== null;

  if (hasChildren) {
    return "record-group";
  }

  if (!picture) {
    return "record";
  }

  return picture;
};

export const generateSampleTargetsFromCopybook = (xmlContent) => {
  return parseCopybookXml(xmlContent);
};

export const COMBSTSI_SAMPLE = `<copybook filename="COMBSTSI.txt" dialect="Mainframe" cb2xml-format="2017">
<item level="01" name="COMBSTSI-REC" position="1" storage-length="572" display-length="572" display-position="1">
<item level="03" name="MESSAGE-HEADER" position="1" storage-length="30" display-length="30" display-position="1">
<item level="05" name="MSGID" picture="X(010)" position="1" storage-length="10" display-length="10" display-position="1"/>
<item level="05" name="MSGLNG" picture="9(005)" position="11" storage-length="5" display-length="5" numeric="COBOL_NUMERIC" display-position="11"/>
<item level="05" name="MSGCNT" picture="9(005)" position="16" storage-length="5" display-length="5" numeric="COBOL_NUMERIC" display-position="16"/>
<item level="05" name="FILLER" picture="X(010)" position="21" storage-length="10" display-length="10" display-position="21"/>
</item>
<item level="03" name="MESSAGE-DATA" position="31" storage-length="542" display-length="542" display-position="31">
<item level="05" name="BGEN-COMBSTSI" position="31" storage-length="542" display-length="542" display-position="31">
<item level="07" name="BGEN-RHIPOL" picture="X(00010)" position="31" storage-length="10" display-length="10" display-position="31"/>
<item level="07" name="BGEN-COMBPOL" picture="X(00010)" position="41" storage-length="10" display-length="10" display-position="41"/>
<item level="07" name="BGEN-COMBAPLNNO" picture="X(00010)" position="51" storage-length="10" display-length="10" display-position="51"/>
<item level="07" name="BGEN-COMBPOLSTS" picture="X(00002)" position="61" storage-length="2" display-length="2" display-position="61"/>
<item level="07" name="BGEN-COMBREASON" picture="X(00500)" position="63" storage-length="500" display-length="500" display-position="63"/>
<item level="07" name="BGEN-COMBRCTSTS" picture="X(00002)" position="563" storage-length="2" display-length="2" display-position="563"/>
<item level="07" name="BGEN-SJ624-CCDATE" picture="9(008)" position="565" storage-length="8" display-length="8" numeric="COBOL_NUMERIC" display-position="565" redefined="true"/>
<item level="07" name="FILLER" position="565" storage-length="8" display-length="8" display-position="565" redefines="BGEN-SJ624-CCDATE">
<item level="09" name="BGEN-SJ624-CCDATE-CCYY" picture="9(004)" position="565" storage-length="4" display-length="4" numeric="COBOL_NUMERIC" display-position="565"/>
<item level="09" name="BGEN-SJ624-CCDATE-MM" picture="9(002)" position="569" storage-length="2" display-length="2" numeric="COBOL_NUMERIC" display-position="569"/>
<item level="09" name="BGEN-SJ624-CCDATE-DD" picture="9(002)" position="571" storage-length="2" display-length="2" numeric="COBOL_NUMERIC" display-position="571"/>
</item>
</item>
</item>
</item>
</copybook>`;
