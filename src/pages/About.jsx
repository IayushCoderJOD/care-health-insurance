import React from "react";
import { HeaderDetails } from "../App";
import useWorkflowStore from '../store/workflowStore';

const About = () => {
  const endpoints = useWorkflowStore((state) => state.endpoints);

  return (
    <>
    <header className="bg-gray-900 text-white px-6 py-3 shadow-md">
                <HeaderDetails endpoints={endpoints} />
    </header>
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">About</h1>

        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
          risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing
          nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
          ligula massa, varius a, semper congue, euismod non, mi. Proin
          porttitor, orci nec nonummy molestie, enim est eleifend mi, non
          fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa,
          scelerisque vitae, consequat in, pretium a, enim. Pellentesque
          congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum
          bibendum augue. Praesent egestas leo in pede. Praesent blandit odio
          eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum
          ante ipsum primis in faucibus orci luctus et ultrices posuere
          cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque
          fermentum. Maecenas adipiscing ante non diam sodales hendrerit.

          Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut
          orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius,
          ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus
          sapien eros vitae ligula. Pellentesque rhoncus nunc et augue.
          Integer id felis. Curabitur aliquet pellentesque diam. Integer quis
          metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet,
          consectetuer adipiscing elit. Morbi vel erat non mauris convallis
          vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus,
          convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat.
          Proin feugiat, augue non elementum posuere, metus purus iaculis
          lectus, et tristique ligula justo vitae magna.

          Aliquam convallis sollicitudin purus. Praesent aliquam, enim at
          fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl
          eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod
          libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean
          suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla
          tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus
          faucibus, felis magna fermentum augue, et ultricies lacus lorem
          varius purus. Curabitur eu amet.
        </p>
      </div>
    </div>
    </>
  );
};

export default About;
