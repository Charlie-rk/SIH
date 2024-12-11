<Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header>
            {" "}
            <div className="flex items-center gap-2">
              {modalType === "alert" ? (
                <span className="text-red-600">
                  {/* Alert symbol */}
                  ⚠
                </span>
              ) : (
                <span className="text-blue-600">
                  {/* Message symbol */}
                  📩
                </span>
              )}
              <h2 className="text-lg font-semibold">
                {modalType === "alert" ? "Send Alert" : "Send Message"}
              </h2>
            </div>
          </Modal.Header>
          <Modal.Body
            className={`rounded-lg ${
              modalType === "alert" ? "bg-red-200" : "bg-blue-200"
            }`}
          >
            <textarea
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder={`Enter your ${
                modalType === "message" ? "message" : "alert"
              } here...`}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            ></textarea>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                // sendNotification();
                setIsModalOpen(false);
              }}
            >
              Submit
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </Modal.Footer>
        </Modal>