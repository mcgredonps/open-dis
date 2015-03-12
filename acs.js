/**
* ACS-javascript library version v0.4
* 
* This ACS-javascript library is heavily modified from Naval Postgraduate School's 
* MV3500 Internetwork Communications and Simulation lab assignment created by 
* Don McGregor (https://www.movesinstitute.org/~mcgredo/MV3500/)
*  
* Copyright (c) 2008-2014, MOVES Institute, Naval Postgraduate School. All rights reserved.
* This work is licensed under the BSD open source license, available at
* https://www.movesinstitute.org/licenses/bsd.html
*
* Author: Dylan Lau Zhiliang (zlau@nps.edu)
* 
* Changelog:
* 
* 0.1 (8 Feb 2015) - ACS Base message header
*                  - ACS Flight status message
*                  - ACS Pose message                   (Dylan)
* 0.2 (12 Feb 2015) - Removed single byte padding in 
* 0.3 (16 Feb 2015) - Bug fix: 
*                       - ACS Base Messager: this.millisecondsSinceLastSecond 
*                       do not need to multiple by 1e06 as received info was 
*                       originally in nanoseconds;
* 0.4 (03 March 2015) - Bug fix: 
*                       Found bug in code. ACS Marking do not need charector sets
*                       It solve the problem of missing single byte padding in v0.2
* Future work?
* ACS protocol version number
* ACS "force id" (Multiple subswarms sharing the same force id can work together)
*/

if (typeof acs === "undefined")
   acs = {};
   
// Support for node.js style modules; ignore if not using node.js require
if (typeof exports === "undefined")
   exports = {};

acs.InputStream = function(binaryData)
{
    this.dataView = new DataView(binaryData, 0); // data, byte offset
    this.currentPosition = 0;                    // ptr to "current" position in array
    
    acs.InputStream.prototype.readUByte = function()
    {
        var data = this.dataView.getUint8(this.currentPosition);
        this.currentPosition = this.currentPosition + 1;
        return data;
    };
    
    acs.InputStream.prototype.readByte = function()
    {
        var data = this.dataView.getInt8(this.currentPosition);
        this.currentPosition = this.currentPosition + 1;
        return data;
    };
    
    acs.InputStream.prototype.readUShort = function()
    {
        var data = this.dataView.getUint16(this.currentPosition);
        this.currentPosition = this.currentPosition + 2;
        return data;
    };
    
    acs.InputStream.prototype.readShort = function()
    {
        var data = this.dataView.getInt16(this.currentPosition);
        this.currentPosition = this.currentPosition + 2;
        return data;
    };
    
    acs.InputStream.prototype.readUInt = function()
    {
        var data = this.dataView.getUint32(this.currentPosition);
        this.currentPosition = this.currentPosition + 4;
        return data;
    };
    
    acs.InputStream.prototype.readInt = function()
    {
        var data = this.dataView.getInt32(this.currentPosition);
        this.currentPosition = this.currentPosition + 4;
        return data;
    };
    
    /** Read a long integer. Assumes big endian format. Uses the BigInteger package. */
    acs.InputStream.prototype.readLongInt = function()
    {
        var data1 = this.dataView.getInt32(this.currentPosition);
        var data2 = this.dataView.getInt32(this.currentPosition + 4);
        
        this.currentPosition = this.currentPosition + 8;
        
    };
   
    acs.InputStream.prototype.readFloat32 = function()
    {
        var data = this.dataView.getFloat32(this.currentPosition);
        this.currentPosition = this.currentPosition + 4;
        return data;
    };
    
    acs.InputStream.prototype.readFloat64 = function()
    {
        var data = this.dataView.getFloat64(this.currentPosition);
        this.currentPosition = this.currentPosition + 8;
        return data;
    };
    
    acs.InputStream.prototype.readLong = function()
    {
        console.log("Problem in acs.InputStream. Javascript cannot natively handle 64 bit ints");
        console.log("Returning 0 from read, which is almost certainly wrong");
        this.currentPosition = this.currentPosition + 8;
        return 0;
    };
};

exports.InputStream = acs.InputStream;
// end of InputStream Class

if (typeof acs === "undefined")
   acs = {};
   
// Support for node.js style modules; ignore if not using node.js require
if (typeof exports === "undefined")
   exports = {};

/**
 * @param binaryDataBuffer ArrayBuffer
*/
acs.OutputStream = function(binaryDataBuffer)
{
    this.binaryData = binaryDataBuffer;
    this.dataView = new DataView(this.binaryData); // data, byte offset
    this.currentPosition = 0;                    // ptr to current position in array
    
    acs.OutputStream.prototype.writeUByte = function(userData)
    {   
        this.dataView.setUint8(this.currentPosition, userData);
        this.currentPosition = this.currentPosition + 1;
    };
    
    acs.OutputStream.prototype.writeByte = function(userData)
    {
        this.dataView.setInt8(this.currentPosition, userData);
        this.currentPosition = this.currentPosition + 1;
    };
    
    acs.OutputStream.prototype.writeUShort = function(userData)
    {
        this.dataView.setUint16(this.currentPosition, userData);
        this.currentPosition = this.currentPosition + 2;
    };
    
    acs.OutputStream.prototype.writeShort = function(userData)
    {
        this.dataView.setInt16(this.currentPosition, userData);
        this.currentPosition = this.currentPosition + 2;
    };
    
    acs.OutputStream.prototype.writeUInt = function(userData)
    {
        this.dataView.setUint32(this.currentPosition, userData);
        this.currentPosition = this.currentPosition + 4;
    };
    
    acs.OutputStream.prototype.writeInt = function(userData)
    {
        this.dataView.setInt32(this.currentPosition, userData);
        this.currentPosition = this.currentPosition + 4;
    };
   
    acs.OutputStream.prototype.writeFloat32 = function(userData)
    {
        this.dataView.setFloat32(this.currentPosition, userData);
        this.currentPosition = this.currentPosition + 4;
    };
    
    acs.OutputStream.prototype.writeFloat64 = function(userData)
    {
        this.dataView.setFloat64(this.currentPosition, userData);
        this.currentPosition = this.currentPosition + 8;
    };
    
    acs.OutputStream.prototype.writeLong = function(userData)
    {
        console.log("Problem in acs.outputStream. Javascript cannot natively handle 64 bit ints");
        console.log("writing 0, which is almost certainly wrong");
        this.dataView.setInt32(this.currentPosition, 0);
        this.dataView.setInt32(this.currentPosition + 4, 0);
        this.currentPosition = this.currentPosition + 8;
    };
};

exports.OutputStream = acs.OutputStream;
// end of OutputStream Class

if (typeof acs === "undefined")
 acs = {};
 
// Support for node.js style modules; ignore if not using node.js require
if (typeof exports === "undefined")
   exports = {};
 
 /**
  * The acs_message factory is responsible for decoding binary data and turning
  * it into the appropriate type of acs_message.
  * 
  * The websocket will typically send the web page a binary
  * array of data. It could be any one of dozens of acs_messages. The start of
  * all acs_messages is the same--they have the same header. One of the fields in 
  * the header is the MessageType, an 8 bit integer with a unqiue value for
  * each type of acs_message. We have to peak at that value, decide what type
  * of acs_message to create of the binary we have received, and then decode it.
  * 
 */

 acs.PduFactory = function()
 {
     
 };
 
 /**
  * decode incoming binary data and
  * return the correct type of acs_message.
  * 
  * @param {type} data the acs binary data
  * @returns {Pdu} Returns an instance of some acs_message, be it flight status, pose. Exception if PduType not known.
  */
 acs.PduFactory.prototype.createPdu = function(data)
 {
     var asUint8Array = new Uint8Array(data);
     var pduType = asUint8Array[0];
     var inputStream = new acs.InputStream(data);
     var newPdu = null;
     
     try
     {
        switch(pduType)
        {
            case 0:     // FlightStatus msg_type = 0x00
                newPdu = new acs.FlightStatusMsg();
                newPdu.initFromBinaryACS(inputStream);
                break;

            case 1:     // Pose msg_type = 0x01
                newPdu = new acs.PoseMsg();
                newPdu.initFromBinaryACS(inputStream);
                break; 

            case 128:   // Heartbeat msg_type = 0x80
                console.log("Heartbeat ACS message Received", evt.data);
                break;

            case 129:   // Arm msg_type = 0x81
                console.log("Arm ACS message Received", evt.data);
                break;

            case 130:     // Mode msg_type = 0x82
                console.log("Mode ACS message Received", evt.data);
                break;

            case 131:     // Land msg_type = 0x83
                console.log("Land ACS message Received", evt.data);
                break;
            
            case 132:     // LandAbort msg_type = 0x84
                console.log("LandAbort ACS message Received", evt.data);
                break;

            case 133:     // GuidedGoto msg_type = 0x85
                console.log("GuidedGoto ACS message Received", evt.data);
                break;

            case 134:     // WaypointGoto msg_type = 0x86
                console.log("WaypointGoto ACS message Received", evt.data);
                break;

            case 135:     // SlaveSetup msg_type = 0x87
               console.log("SlaveSetup ACS message Received", evt.data);
                break;
            
            case 136:     // FlightReady msg_type = 0x88
                console.log("FlightReady ACS message Received", evt.data);
                break;

            case 137:     // SetSubswarm msg_type = 0x89
                console.log("SetSubswarm ACS message Received", evt.data);
                break;

            case 138:     // SetController msg_type = 0x8A
                console.log("SetController ACS message Received", evt.data);
                break;

            case 139:     // FollowerSetup msg_type = 0x8B
                console.log("FollowerSetup ACS message Received", evt.data);
                break;
            
            case 140:     // WPSequencerSetup msg_type = 0x8C
                console.log("WPSequencerSetup ACS message Received", evt.data);
                break;

            case 254:     // PayloadHeartbeat msg_type = 0xFE
                console.log("PayloadHeartbeat ACS message Received", evt.data);
                break;

            case 255:     // PayloadShutdown msg_type = 0xFF
                console.log("PayloadShutdown ACS message Received", evt.data);
                break;

            default:
               throw  "ACS Message Type: " + pduType + " Unrecognized acs_message. Add acs_message in acs.ACSFactory.";
        }
    }
    // This also picks up any errors decoding what we though was a "normal" acs_message
    catch(error)
    {
      newPdu = null;
    }
     
     return newPdu;
 };

exports.PduFactory = acs.PduFactory;
// end of ACSFactory Class

if (typeof acs === "undefined")
 acs = {};

// Support for node.js style modules. Ignored if used in a client context.
// See http://howtonode.org/creating-custom-modules
if (typeof exports === "undefined")
 exports = {};

acs.FlightStatusMsg = function()
{
    /* add force id? */
   
    this.header = new acs.Pdu();  
    
    /**
    * mode_and_flags = self.mode << 12 \
    * | (0x0800 & _bool16(self.armed)) \
    * | (0x0400 & _bool16(self.ok_ahrs)) \
    * | (0x0200 & _bool16(self.ok_as)) \
    * | (0x0100 & _bool16(self.ok_gps)) \
    * | (0x0080 & _bool16(self.ok_ins)) \
    * | (0x0040 & _bool16(self.ok_mag)) \
    * | (0x0020 & _bool16(self.ok_pwr)) \
    * | (0x0010 & _bool16(self.ready)) \
    * & 0xfff0  # Zeroize unused bits
    */
   this.mode = 0;

   /** int # Number of satellites (int, 0-255) */
   this.gps_stats = 0;

   /** int # Battery % remaining (int, 0-100) */
   this.batt_rem = 0;

   /** int # Battery Voltage (int, mV) */
   this.batt_vcc = 0;

   /** float # Airspeed (float, m/s) */
   this.airspeed = 0;

   /** AGL (int, millimeters) */
   this.alt_rel = 0;

   /** Current mission (waypoint) index (0-65535) */
   this.mis_cur = 0;
   
   /** UNUSED byte */
   this.padding = 0;
   
   /** # Controller mode (0-15) */
   this.ctl_mode = 0;
   
    /**  # Controller ready flags (bool/bit array)
    *    # (Index 1 is low bit, 16 is high bit, no 0)
    *     zero-filled array of padding 
    *     */
   this.ctl_ready_bits = 0;

   /** Friendly name of aircraft (16 chars max) */
   this.name = new acs.Marking();  

  acs.FlightStatusMsg.prototype.initFromBinaryACS = function(inputStream)
  {
       this.header.initFromBinaryACS(inputStream);
       // '>HBBHhhHxBH16s'
       this.mode = inputStream.readUShort();
       this.gps_stats = inputStream.readUByte();
       this.batt_rem = inputStream.readUByte();
       this.batt_vcc = inputStream.readUShort();
       this.airspeed = inputStream.readShort() / 100;
       this.alt_rel = inputStream.readShort() * 100;
       this.mis_cur = inputStream.readUShort();
       this.padding = inputStream.readUByte();
       this.ctl_mode = inputStream.readUByte();
       this.ctl_ready_bits = inputStream.readUShort();
       this.name.initFromBinaryACS(inputStream);
  };

  acs.FlightStatusMsg.prototype.encodeToBinaryACS = function(outputStream)
  {
       this.header.encodeToBinaryACS(outputStream);
       // '>HBBHhhHxBH16s'
       outputStream.writeUShort(this.mode);
       outputStream.writeUByte(this.gps_stats);
       outputStream.writeUByte(this.batt_rem);
       outputStream.writeUShort(this.batt_vcc);
       outputStream.writeShort(int(this.airspeed * 100));
       outputStream.writeShort(int(this.alt_rel / 100));
       outputStream.writeUShort(this.mis_cur);
       outputStream.writeUByte(this.padding); 
       outputStream.writeUByte(this.ctl_mode);
       outputStream.writeUShort(this.ctl_ready_bits);
       this.name.encodeToBinaryACS(outputStream);
  };
}; // end of class

 // node.js module support
exports.FlightStatusMsg = acs.FlightStatusMsg;

// End of FlightStatusMsg class

if (typeof acs === "undefined")
 acs = {};

// Support for node.js style modules. Ignored if used in a client context.
// See http://howtonode.org/creating-custom-modules
if (typeof exports === "undefined")
 exports = {};

acs.PoseMsg = function()
{
   this.header = new acs.Pdu();
   /** lat # Decimal degrees (e.g. 35.123456) */
   this.lat = 0;

   /** lon # # Decimal degrees (e.g. -120.123456) */
   this.lon = 0;

   /** Decimal meters MSL (WGS84) */
   this.alt = 0;

   /** Quaternion X */
   this.q_x = 0;
   
   /** Quaternion Y */
   this.q_y = 0;
   
   /** Quaternion Z */
   this.q_z = 0;
   
   /** Quaternion W */
   this.q_w = 0;

   /** Linear velocity x (cm/s) */
   this.vlx = 0;
   
   /** Linear velocity y (cm/s) */
   this.vly = 0;
   
   /** Linear velocity z (cm/s) */
   this.vlz = 0;

   /** # Angular velocity x (rad/s * 100) */
   this.vax = 0;
   
   /** # Angular velocity y (rad/s * 100) */
   this.vay = 0;
   
   /** # Angular velocity z (rad/s * 100) */
   this.vaz = 0;

  acs.PoseMsg.prototype.initFromBinaryACS = function(inputStream)
  {
       this.header.initFromBinaryACS(inputStream);
       //'>lllllllhhhhhh'
       this.lat = inputStream.readInt() / 10000000;
       this.lon = inputStream.readInt() / 10000000;
       this.alt = inputStream.readInt() / 1000;
       this.q_x = inputStream.readInt() / 1000000000000;
       this.q_y = inputStream.readInt() / 1000000000000;
       this.q_z = inputStream.readInt() / 1000000000000;
       this.q_w = inputStream.readInt() / 1000000000000;
       this.vlx = inputStream.readShort() / 100;
       this.vly = inputStream.readShort() / 100;
       this.vlz = inputStream.readShort() / 100;
       this.vax = inputStream.readShort() / 100;
       this.vay = inputStream.readShort() / 100;
       this.vaz = inputStream.readShort() / 100;
  };

  acs.PoseMsg.prototype.encodeToBinaryACS = function(outputStream)
  {
       this.header.encodeToBinaryACS(outputStream);
       //'>lllllllhhhhhh'
       outputStream.writeInt(int(this.lat * 10000000));
       outputStream.writeInt(int(this.lon * 10000000));
       outputStream.writeInt(int(this.alt * 1000));
       outputStream.writeInt(int(this.q_x * 1000000000));
       outputStream.writeInt(int(this.q_y * 1000000000));
       outputStream.writeInt(int(this.q_x * 1000000000));
       outputStream.writeInt(int(this.q_w * 1000000000));
       outputStream.writeShort(int(this.vlx * 100));
       outputStream.writeShort(int(this.vly / 100));
       outputStream.writeShort(int(this.vlz * 100));
       outputStream.writeShort(int(this.vax * 100));
       outputStream.writeShort(int(this.vay / 100));
       outputStream.writeShort(int(this.vaz * 100));
  };
}; // end of class

 // node.js module support
exports.Pose = acs.Pose;

// End of PoseMsg class

acs.Marking = function()
{
   /** The characters */
   this.characters = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

  acs.Marking.prototype.initFromBinaryACS = function(inputStream)
  {
       for(var idx = 0; idx < 16; idx++)
       {
          this.characters[ idx ] = inputStream.readByte();
       }
  };

  acs.Marking.prototype.encodeToBinaryACS = function(outputStream)
  {
       for(var idx = 0; idx < 16; idx++)
       {
          outputStream.writeByte(this.characters[ idx ] );
       }
  };
  
  /*
   * Returns the byte array marking, in string format. 
   * @return string format marking characters
   */
  acs.Marking.prototype.getMarking = function()
  {
      var marking = "";
      for(var idx = 0; idx < 16; idx++)
      {
          marking = marking + String.fromCharCode(this.characters[idx]);
      }
      
      return marking;
  };
  
  /**
   * Given a string format marking, sets the bytes of the marking object
   * to the appropriate character values. Clamps the string to no more
   * than 11 characters.
   * 
   * @param {String} newMarking string format marking
   * @returns {nothing}
   */
  acs.Marking.prototype.setMarking = function(newMarking)
  {
      var stringLen = newMarking.length;
      if(stringLen > 16)
          stringLen = 16;
      
      // Copy over up to 11 characters from the string to the array
      var charsCopied = 0;
      while(charsCopied < stringLen)
      {          
          this.characters[charsCopied] = newMarking.charCodeAt( charsCopied );
          charsCopied++;
      }
      
      // Zero-fill the remainer of the character array
      while(charsCopied < 16)
      {
          this.characters[ charsCopied ] = 0;
          charsCopied++;
      }
      
  };
}; // end of class

 // node.js module support
exports.Marking = acs.Marking;

// End of Marking class

/**
 * The superclass for all PDUs. 
 *
 *    ACS Packet header format (all fields in network byte order):
  *  - (8b)  Message type
  *  - (8b)  Flags (high-3) + Subswarm ID (low-5)
  *           - 0x80 - Message sent reliably (send-buffered)
  *           - 0x40 - SYNchronize with remote side
  *           - 0x20 - UNUSED
  *  - (8b)  Source ID
  *  - (8b)  Destination ID
  *  - (16b) Reliable messaging sequence number
  *  - (16b) Reliable messaging acknowledgment number (+1)
  *  - (32b) Seconds since Unix epoch
  *  - (16b) Milliseconds since last second
  *  - (16b) UNUSED
  */

if (typeof acs === "undefined")
 acs = {};

// Support for node.js style modules. Ignored if used in a client context.
// See http://howtonode.org/creating-custom-modules
if (typeof exports === "undefined")
 exports = {};

acs.Pdu = function()
{
   // Add protocol version number? 
   
   /** (8b)  Message type */
   this.messageType = 0;

   /** (8b)  Flags (high-3) + Subswarm ID (low-5)
    *  - 0x80 - Message sent reliably (send-buffered)
    *  - 0x40 - SYNchronize with remote side
    *  - 0x20 - UNUSED
    */
   this.flags = 0;

   /** (8b)  Source ID */
   this.sourceID = 0;

   /** (8b)  Destination ID */
   this.destinationID = 0;

   /** (16b) Reliable messaging sequence number */
   this.reliableMsgSeq = 0;

   /** (16b) Reliable messaging acknowledgment number (+1) */
   this.reliableMsgAck = 0;

   /** (32b) Seconds since Unix epoch */
   this.secondsSinceUnixEpoch = 0;
   
   /** (16b) Milliseconds since last second */
   this.millisecondsSinceLastSecond = 0;
   
   /** (16b) UNUSED */
   this.padding = 0;

  acs.Pdu.prototype.initFromBinaryACS = function(inputStream)
  {
       //>BBBBHHLH2x
       this.messageType = inputStream.readUByte();
       this.flags = inputStream.readUByte();
       this.sourceID = inputStream.readUByte();
       this.destinationID = inputStream.readUByte();
       this.reliableMsgSeq = inputStream.readUShort();
       this.reliableMsgAck = inputStream.readUShort();
       this.secondsSinceUnixEpoch = inputStream.readUInt();
       this.millisecondsSinceLastSecond = inputStream.readUShort() // Received info is in nanaseconds / 1000000;
       this.padding = inputStream.readUShort();
  };

  acs.Pdu.prototype.encodeToBinaryACS = function(outputStream)
  {
       //>BBBBHHLH2x
       outputStream.writeUByte(this.messageType);
       outputStream.writeUByte(this.flags);
       outputStream.writeUByte(this.sourceID);
       outputStream.writeUByte(this.destinationID);
       outputStream.writeUShort(this.reliableMsgSeq);
       outputStream.writeUShort(this.reliableMsgAck);
       outputStream.writeUInt(this.secondsSinceUnixEpoch);
       outputStream.writeUShort(this.millisecondsSinceLastSecond); // Receving ends expect this to be in ms
       outputStream.writeUShort(this.padding);
  };
}; // end of class

 // node.js module support
exports.Pdu = acs.Pdu;

// End of Pdu class



