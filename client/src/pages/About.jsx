// import Graph from "../components/Graph";

// import Level2DashBoard from "../components/Level2DashBoard";

/* eslint-disable react/no-unescaped-entities */
export default function About() {
  return (
    <>
    
    <div className='min-h-screen flex items-center justify-center'>
     
      <div className='max-w-2xl mx-auto p-3 text-center'>
      <div>
  <h1 className="text-3xl font font-semibold text-center my-7">
    About ParcelPulse
  </h1>
  <div className="text-md text-gray-500 flex flex-col gap-6">
    <p>
      ParcelPulse revolutionizes parcel delivery with a dynamic, multi-modal transportation network optimized for speed, cost, and customer convenience. It seamlessly connects main hubs (airports, seaports) and city hubs, ensuring efficient delivery across all levels.
    </p>
    <p>
      Our delivery options empower customers to choose their priorities, whether it's the fastest delivery, the cheapest option, a balanced approach, or meeting a specific deadline. We leverage cutting-edge algorithms like Dijkstra’s for routing and reinforcement learning for optimization.
    </p>
    <p>
      Real-time weather monitoring ensures that delivery paths are adjusted dynamically, avoiding unfavorable conditions. This guarantees reliability and minimizes delays in the delivery process.
    </p>
    <p>
      Space management at hubs is handled using advanced max-flow algorithms, optimizing storage and routing to handle large volumes efficiently. With ParcelPulse, your parcel always has a place in the network.
    </p>
    <p>
      Customers can track their parcels in real-time through our user-friendly app and website using a unique parcel ID. Integration with transport agencies provides live updates, and notifications keep users informed about the status of their delivery.
    </p>
    <p>
      Leveraging machine learning, ParcelPulse determines parcel sizes from images to allocate transportation resources effectively. Delivery predictions are refined using historical data, ensuring accurate estimated times for both senders and receivers.
    </p>
    <p>
      Our intuitive interface allows users to select delivery options, track parcels, and receive notifications with ease. Additionally, interactive features enable users to report issues or provide feedback, enhancing the overall experience.
    </p>
    <p>
      ParcelPulse not only delivers parcels but also delivers trust, speed, and transparency, redefining logistics for the modern era.
    </p>
  </div>
</div>

      </div>
    </div>
    </>
  );
}
